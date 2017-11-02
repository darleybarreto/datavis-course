from flask import Flask,jsonify
from pymongo import MongoClient
from bson.json_util import dumps

client = MongoClient('mongodb://localhost:27017/')
db = client["datavis"]
chamber = db["chamber"]

app = Flask(__name__)

@app.route("/<name>")
def searchDeputy(name):
	cursor = chamber.find({"congressperson_name":"/"+name+"/i"},{"_id":False})
	return jsonify(Response=dumps(cursor))


if __name__ == '__main__':
	app.run(port=8888)