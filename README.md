# Project-Insight

Campus is a big place, and involves a large number of people doing a variety of tasks. The goal of this project is to provide a way to perform some of the tasks required to run the university and to enable effective querying of the metadata from around campus. This will involve working with courses, prerequisites, past course averages, room scheduling, and timetable creation.

The project involves writing the back-end server that takes 2 types of requests: (1) requests to upload, update, or remove a dataset from the server; (2) requests to query and aggregate datasets. 

The supported requests are:
* PUT /dataset/:id allows to submit a zip file that will be parsed and used for future queries
* DELETE /dataset/:id deletes the existing dataset stored.
* POST /query sends the query to the application. The query will be in JSON format in the post body.

Requests are made using JSON according to the following EBNF:

QUERY ::='{'BODY ', ' OPTIONS  (', ' TRANSFORMATIONS)? '}'

BODY ::= 'WHERE: {' (FILTER)? '}'
OPTIONS ::= 'OPTIONS: {' COLUMNS (', ' SORT)? '}'
TRANSFORMATIONS ::= 'TRANSFORMATIONS: {' GROUP ', ' APPLY '}'

FILTER ::= (LOGICCOMPARISON | MCOMPARISON | SCOMPARISON | NEGATION)

LOGICCOMPARISON ::= LOGIC ': [{' FILTER ('}, {' FILTER )* '}]'  
MCOMPARISON ::= MCOMPARATOR ': {' m_key ':' number '}'  
SCOMPARISON ::= 'IS: {' s_key ': ' [*]? inputstring [*]? '}'  
NEGATION ::= 'NOT: {' FILTER '}'

LOGIC ::= 'AND' | 'OR' 
MCOMPARATOR ::= 'LT' | 'GT' | 'EQ' 

COLUMNS ::= 'COLUMNS:[' (string ',')* string ']'
SORT ::= 'ORDER: ' ('{ dir:' DIRECTION ', keys: [ ' string (',' string)* ']}' | string) 
DIRECTION ::= 'UP' | 'DOWN'  

GROUP ::= 'GROUP: [' (key ',')* key ']'                                                          
APPLY ::= 'APPLY: [' (APPLYKEY (', ' APPLYKEY )* )? ']'  
APPLYKEY ::= '{' string ': {' APPLYTOKEN ':' key '}}'
APPLYTOKEN ::= 'MAX' | 'MIN' | 'AVG' | 'COUNT' | 'SUM'

key             ::= (s_key | m_key)
                    //semantics for each key detailed below

s_key           ::= ('courses_'('dept' | 'id' | 'instructor' |
                                'title' | 'uuid')) | 
                    ('rooms_'('fullname' | 'shortname' | 'number' | 
                              'name' | 'address' | 'type' | 
                              'furniture' | 'href'))           
m_key           ::= ('courses_'('avg' | 'pass' | 'fail' | 'audit' | 'year')) |
                    ('rooms_'('lat' | 'lon' | 'seats))      

inputstring     ::= [^*]+ //one or more of any character except asterisk.