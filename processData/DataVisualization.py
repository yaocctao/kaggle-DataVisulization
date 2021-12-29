# -*- coding: UTF-8 -*-
'''
@Project ：DataVisualization
@File    ：DataVisualization.py
@IDE     ：PyCharm
@Author  ：yaocctao
@Date    ：2021/12/27 19:15
'''
from typing import List, Tuple, Union, Dict
import pandas as pd
from numpy import dtype


class Pipeline():
    def __init__(self, path):
        self.data = self.read_data(path)
        self.dataInfo = self.get_data_info()
        self.dataCount_NanCount = [int(self.data.count().max()), int(self.data.isna().sum().max())]
        # deal the missing value to str 'null'
        self.data = self.data.fillna(value='null')

    def read_data(self, path: str) -> pd.DataFrame:
        suffix = path.split('.')[-1]
        if suffix == 'csv':
            data = pd.read_csv(path)
            return data
        elif suffix == 'xlsx':
            # need pip uninstall xlrd
            data = pd.read_excel(path)
            return data
        else:
            raise Exception("read_data error: can't not read this file")

    def get_dataset_3d_chart(self) -> Union[Tuple[List, int], None]:
        try:
            intColumns = self.data.select_dtypes(include=["int64", "int32", "float32", "float"]).columns.to_list()
            if len(intColumns) == 2:
                strColumn = self.data.select_dtypes(include=["object"]).columns[0]
                intColumns.insert(0, strColumn)
            elif len(intColumns) < 2:
                return None
            data = self.data[intColumns]
            maxNum = int(data[intColumns[1]].max())
            dataSet = [list(i) for i in data.values]
            dataSet.insert(0, data.columns.to_list())
        except:
            return None
        return dataSet, maxNum

    def get_data_freq(self) -> Union[List, None]:
        try:
            data = self.data.select_dtypes(include=["object"])
            describe = data.describe()
            columns = describe.columns.to_list()
            freq = describe.loc['freq'].to_numpy()
            counts = self.dataCount_NanCount[0]
            top = describe.loc['top'].to_list()
            radio = freq / counts
            radio = list(map(lambda x: float(x), radio.tolist()))
            result = [{"name": top[i], "value": round(data, 2) * 100, "type": columns[i]} for i, data in
                      enumerate(radio)]
            result = sorted(result, key=lambda x: x['value'], reverse=True)
        except:
            return None
        return result

    def get_data_info(self) -> Union[List, None]:
        try:
            info = self.data.isna().sum().to_dict()
            result = []
            for key, value in info.items():
                result.append({'name': str(key), 'value': int(value)})
        except:
            return None
        return result

    def get_data_distribute(self):
        try:
            data = self.data
            dataDict = dict()
            unique = data.nunique()
            datas = {'names': [], 'datas': []}
            unique = dict(
                sorted(unique[(unique < self.dataCount_NanCount[0]) & (unique > 5)].items(), key=lambda x: x[1])[0:2])

            for u in unique.keys():
                datas['names'].append(data.groupby(u).count().index.to_list())
                datas['datas'].append(
                    [int(i) for i in data.groupby(u).count().iloc[:, :1].to_numpy().reshape(1, -1)[0]])
            dataDict['columns'] = list(unique.keys())
            dataDict['datas'] = datas
        except:
            return None
        return dataDict

    def get_boxplot(self) -> Union[List, None]:
        try:
            data = self.data.select_dtypes(include=["int64", "int32", "float32", "float"]).to_dict()
            dataDict = []
            for k, v in data.items():
                data = [int(i) for i in v.values()]
                data.insert(0, k)
                dataDict.append(data)
            if dataDict == []:
                return None
        except:
            return None

        return dataDict

    def get_parallelPlot(self) -> Union[Dict, None]:
        try:
            data = self.data
            dtypes = data.dtypes.to_list()
            numpy_data = data.to_numpy()
            columns = data.columns.to_list()
            parallelAxis = []
            unique = data.nunique()
            group = unique[(unique < self.dataCount_NanCount[0]) & (unique > 3)].sort_values().index[0]
            groups = data[group].unique().tolist()
            result = {"groupDim": columns.index(group), "groupName": group, "groups": groups}
            for i, name in enumerate(data.columns):
                if dtypes[i] in [dtype('int64'), dtype('int32'), dtype('float64')]:
                    parallelAxis.append({'dim': i, 'name': name, 'nameLocation': 'end'})
            if parallelAxis == []:
                return None
            result['parallelAxis'] = parallelAxis
            result['data'] = [list(i) for i in numpy_data]
        except:
            return None

        return result

    def get_line(self) -> Union[Dict, None]:
        try:
            dataDict = {}
            data = self.data
            unique = self.data.nunique()
            xDataColumn = unique[unique == self.dataCount_NanCount[0]].index[0]
            xData =[float(d) for d in  data[xDataColumn].to_list()]
            data = data.drop(xDataColumn, axis=1)
            numData = data.select_dtypes(include=["int64", "int32", "float32", "float"])
            columnsNames = numData.columns.to_list()
            numData = numData.T.to_numpy()
            dataList = []
            for row in numData:
                rows = []
                for cell in row:
                    rows.append(float(cell))
                dataList.append(rows)
            dataDict['columns'] = columnsNames
            dataDict['xName'] = xDataColumn
            dataDict['data'] = dataList
            dataDict['xData'] = xData
        except:
            return None
        if dataDict == {}:
            return None
        return dataDict
