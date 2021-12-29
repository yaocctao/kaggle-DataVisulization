# -*- coding: UTF-8 -*-
'''
@Project ：DataVisualization
@File    ：main.py
@IDE     ：PyCharm
@Author  ：yaocctao
@Date    ：2021/12/27 19:16
'''
from processData.DataVisualization import Pipeline
from flask import Flask, render_template, jsonify, request, flash, redirect, url_for
from werkzeug.utils import secure_filename
import os
import sys
from logging import DEBUG

# must set  static_url_path='' ,otherwise flask can't read the static files
app = Flask(__name__, static_url_path='')
app.logger.setLevel(DEBUG)
# must set variable_start_string = '[[' or other, because Flask and vue have a syntax conflict
app.jinja_env.variable_start_string = '[['
app.jinja_env.variable_end_string = ']]'
UPLOAD_FOLDER = './processData/files'
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

path = None


@app.route('/main')
def main():
    return render_template("main.html")


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            global path
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            return redirect(url_for("index", path=path), code=302)


@app.route('/')
def index():
    if path == None:
        return redirect('main')
    else:
        global pipeline
        pipeline = Pipeline(path)

        print(path, file=sys.stderr)
        return render_template("index.html", file=True)


@app.route('/dataset_3d_chart')
def dataset_3d_chart():
    result = pipeline.get_dataset_3d_chart()
    if result == None:
        return 'false'
    else:
        list_data = result[0]
        maxNum = result[1]
        return jsonify({"maxNum": maxNum, "data": list_data[:]})


@app.route('/distribute')
def distribute():
    result = pipeline.get_data_distribute()
    if result == None:
        return 'false'
    else:
        return jsonify(result)


@app.route('/info')
def info():
    result = pipeline.dataInfo
    count = pipeline.dataCount_NanCount
    if result == None:
        return 'false'
    else:
        return jsonify({'data': result, 'total': count[0]})


@app.route('/boxplot')
def boxplot():
    result = pipeline.get_boxplot()
    if result == None:
        return 'false'
    else:
        return jsonify(result)


@app.route("/frequency")
def dataset_frequency():
    data = pipeline.get_data_freq()
    if data == None:
        return 'false'
    else:
        return jsonify(data[:4])


@app.route('/parallelPlot')
def parallelPlot():
    result = pipeline.get_parallelPlot()
    if result == None:
        return 'false'
    else:
        return jsonify(result)


@app.route('/line')
def line():
    result = pipeline.get_line()
    if result == None:
        return 'false'
    else:
        return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
