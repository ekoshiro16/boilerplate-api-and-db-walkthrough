# Join Tables / Thru Tables (How do we relate PostgreSQL tables together?)

## Talking Points: 

- How to make a new table that connects to another table? 
    - A: Use the `references` keyword
    - Skeleton Syntax (use this for individual columns that should be connected to other columns in other tables)
        - `"columnName" DATATYPE REFERENCES "otherTableName"("otherTableColumn");`

- How to write JOIN statements for fetching data from connected tables?
    - INNER JOIN
        - Skeleton Syntax: 
            - Legend: The / indicate where a new line break occurs
            - `SELECT * FROM tableA / JOIN tableB / ON tableA.columnA = tableB.columnB;`
    - LEFT JOIN
        - Skeleton Syntax:
            - Legend: The / indicate where a new line break occurs
            - `SELECT * FROM tableA / LEFT JOIN tableB / ON tableA.columnA = tableB.columnB;`
    - RIGHT JOIN
        - Skeleton Syntax:
            - Legend: The / indicate where a new line break occurs
            - `SELECT * FROM tableA / RIGHT JOIN tableB / ON tableA.columnA = tableB.columnB;`
    - FULL JOIN
        - Skeleton Syntax:
            - Legend: The / indicate where a new line break occurs
            - `SELECT * FROM tableA / FULL JOIN tableB / ON tableA.columnA = tableB.columnB;`

- Setting up relational tables in a practical project
    - Review Website Groups: 
        - Products / Companies (basically the thing that we're reviewing)
        - Users
        - Reviews 

Companies:
(pk) COMPANYID  |  COMPANYNAME
 1                   Five Guys 
 2                  Shake Shack
 3                  McDonalds

Users:
(pk) USERID  |  USERNAME | PASSWORD 
 1               ellieo1    ellieo1
 2               edhad      edhad

Reviews: 
TITLE            | (fk) COMPANIES(companyId) | (fk) USERS()
'It is da best!'   1                            1
'Kinda mid'        2                            1
'gotta try the grimace shake' | 3                2