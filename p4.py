from pyhive import hive
import sys
import json
url = sys.argv[1]
    
HOST = "127.0.0.1"
PORT = 10000
USERNAME = "archisha_majee"
conn = hive.Connection(host=HOST, port=PORT, username=USERNAME, database='default')
cursor = conn.cursor()
cursor.execute(f'SELECT search.term, CAST(SUM(value) as float)/SUM(search.clicks["{url}"]) AS percentage FROM search LATERAL VIEW EXPLO$
res = []
for result in cursor.fetchall():
    if result[1]:
        if result[1] > 0.05:
            res.append(result[0])
print(json.dumps(res),flush=True)
