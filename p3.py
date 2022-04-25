from pyhive import hive
import sys
import json

HOST = "127.0.0.1"
PORT = 10000
USERNAME = "archisha_majee"
conn = hive.Connection(host=HOST, port=PORT, username=USERNAME, database='default')
cursor = conn.cursor()
url = sys.argv[1]
cursor.execute(f'SELECT SUM(search.clicks["{url}"]) FROM search WHERE search.clicks["{url}"] IS NOT NULL')
for result in cursor.fetchall():
    data = result[0]
    print(data,flush=True)
