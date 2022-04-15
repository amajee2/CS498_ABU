import findspark
findspark.init()
import pyspark
import sys
from flask import Flask, jsonify, request 
import json 

# argument handling
if len(sys.argv) != 3:
        raise Exception("Exactly 2 arguments are required: <inputUri> <outputUri>")
inputUri=sys.argv[1]
outputUri=sys.argv[2]

def myMapFunc(x): # takes an input, provides an output pairing
        return (len(x), 1)
        
def myReduceFunc(v1, v2): # Merge two values with a common key - operation must be assoc. and commut.
        return v1 + v2

sc = pyspark.SparkContext()
print("Spark Context initialized.")

# textFile --> take the address of a text file, return it as an RDD (hadoop dataset) of strings
lines = sc.textFile(sys.argv[1])
line_lens = lines.map(myMapFunc).reduceByKey(myReduceFunc).collect()
print("Operations complete.")
line_lens.saveAsTextFile(sys.argv[2])
print("Output saved as text file.")

# Part Two and Three 

# Get line lenghts and count
f1 = 'output/part-00000'
f2 = 'output/part-00001'

word_dict = dict()
with open(f1) as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        len_count_arr = line[1:len(line) - 1].split(', ')
        key = len_count_arr[0]
        value = int(len_count_arr[1])
        word_dict[key] = value

with open(f1) as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        len_count_arr = line[1:len(line) - 1].split(', ')
        key = len_count_arr[0]
        value = int(len_count_arr[1])
        word_dict[key] = value

# Part 4
# Where x -> (word, sentence, weights)
# Return (word, (sentence, sen_val))
def mapFuncOxford(x): # takes an input, provides an output pairing
    word = x[0]
    sen = x[1]
    weights = x[2]
    if word in sen:
        weight = 0
        for char in sen:
            if char.isAlpha() and char in weights.keys():
                weight+= weights[char]
        return (word, (sen, weight))
    else: 
        return (word, (sen, 0))

# v -> (sentence, sentence val)
def reduceFuncOxford(v1, v2): # Merge two values with a common key - operation must be assoc. and commut.
    if v2[1] > v1[1]:
        return v2
    else: 
        return v1

input_text = 'input.txt'
war_peace_lines = []
with open(input_text) as f:
    war_peace_lines = f.readlines()
war_peace_lines = [l.strip() for l in war_peace_lines]

def check_done(): 
    filesize = os.path.getsize("results.json")
    if filesize == 0: 
        return False
    else: 
        return True

# start flask app 
app = Flask(__name__)

@app.route("/lengthCounts", methods=['GET'])
def lengthCounts():
    return jsonify(word_dict)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json # get data in json format
    words = data['wordlist']
    weights = data['weights']

    # create tuples to map on 
    collection = [(word,s,weights) for word in words for s in war_peace_lines]

    # parallelize --> takes existing collection and create RDD
    rdd_tuples = sc.parallelize(collection)

    # Flatmap --> Apply a function to each element of the dataset, then flatten the result.
    sen_val = rdd_tuples.map(mapFuncOxford).reduceByKey(reduceFuncOxford).collect()

    result = dict()
    for sen in sent_val:
        word = sen[0]
        val = sen[1]
        sentence = val[0]
        result[word] = sentence

    with open('./result.json') as f:
        json.dump(result, f)
    return "OK"

@app.route('/result', methods=['GET'])
def result():
    if check_done():
        with open('./result.json', 'r') as f:
            x = json.load(f)
        return jsonify(x)
    else:
        return "Not done yet"

# make it run on your marchine's ip by host = 0.0.0.0
app.run(host='0.0.0.0', port=80)
