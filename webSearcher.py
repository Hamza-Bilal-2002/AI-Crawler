from flask import Flask, render_template, request, jsonify
import xml.etree.ElementTree as ET
from difflib import SequenceMatcher
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def search_xml(file_path, searched_words):
    tree = ET.parse(file_path)
    root = tree.getroot()
    results = []
    for item in root.findall('item'):
        product_type = item.find('product_type').text.lower()
        words = searched_words.split()
        found = all(any(similar(word, token) >= 0.8 for token in product_type.split()) for word in words)
        if found:
            results.append({
                'product_type': item.find('product_type').text,
                'url': item.find('url').text
            })
    return results


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    searched_words = request.form['txt']
    print(f"Searched words: {searched_words}")
    file_path = 'extracted_entities.xml'  # Ensure this file path is correct
    products_searched = search_xml(file_path, searched_words)
    print(f"Products found: {products_searched}")
    return jsonify(products_searched)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
