AI Usage
PromptOutput(ChatGPT)
if I were to store unique topics (such as sports, arts, music) under a SQL table, should I use one column topics as the primary key or use an ID auto increment primary key and topics as unique?Short answer:
?? Use an auto-increment ID as the primary key, and make topic_name UNIQUE.

Recommended design
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    topic_name TEXT NOT NULL UNIQUE
);

Why this is the better choice
1. Stability of primary keys
Primary keys should be:
* Stable
* Immutable
* Meaningless outside the system
Topic names are not stable:
* ¡°Music¡± ¡ú ¡°Music & Audio¡±
* ¡°Sports¡± ¡ú ¡°Sports & Fitness¡±
* Capitalisation changes
* Localisation (¡°Arts¡± ¡ú ¡°ÒÕÊõ¡±)
Changing a primary key that is referenced by other tables is painful and risky.

2. Foreign keys become simpler
With an ID-based primary key:
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    topic_id INT NOT NULL REFERENCES topics(id),
    title TEXT NOT NULL
);
This is:
* Faster to join
* Smaller in storage
* Easier to index
* Less error-prone
Using topic_name as a PK would require:
topic_name TEXT REFERENCES topics(topic_name)
This tightly couples business meaning with relational structure ¡ª a design smell.

3. Performance and indexing
* Integer keys are:
o Faster to compare
o Smaller than strings
o Better for indexing and joins
* Strings as PKs:
o Increase index size
o Slow down joins as data grows
This matters once your forum scales.

4. Still enforces uniqueness correctly
The UNIQUE constraint guarantees:
INSERT INTO topics (topic_name) VALUES ('Music');
INSERT INTO topics (topic_name) VALUES ('Music'); -- ? fails
So you still get logical uniqueness, without making it the PK.

When would a natural key be acceptable?
Using topic_name as the primary key is acceptable only if:
* The value is guaranteed never to change
* It is short
* It is globally unique
* It is never referenced by many other tables
Examples:
* ISO country codes (SG, GB)
* Currency codes (USD, EUR)
* Fixed enums
Forum topics do not meet these criteria.

Best practice summary
Design choiceVerdicttopic_name as PK? Not recommendedAuto-increment ID as PK? Best practicetopic_name with UNIQUE constraint? CorrectComposite keys? Overkill
Final recommendation
Always separate identity from meaning.
id        ¡ú identity (primary key)
topic_name ¡ú meaning (unique, changeable)
If you want, I can also:
* Show how to migrate from a bad schema to a good one
* Discuss slug fields (music, sports)
* Explain how Reddit-like systems structure topics vs subreddits


¡¡¡¡¡¡

