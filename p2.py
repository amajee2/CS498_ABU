#Query 2
from pyhive import hive
import sys
import json
term = sys.argv[1]
if (len(sys.argv) > 2):
    term += " " + sys.argv[2]
    
HOST = "127.0.0.1"
PORT = 10000
USERNAME = "archisha_majee"
conn = hive.Connection(host=HOST, port=PORT, username=USERNAME, database='default')
def extract_term(t):
    return t.split('"')[1]
cursor = conn.cursor()
cursor.execute(f'SELECT SUM(value) FROM search LATERAL VIEW EXPLODE(search.clicks) click_table as url, value WHERE search.term = "{term$
for result in cursor.fetchall():
    d = result[0]
    print(d,flush=True)
