import pandas as pd
import csv
import json

# # read an excel file and convert
# # into a dataframe object
# read_file = pd.DataFrame(pd.read_excel("data.xlsx"))
#
# read_file.to_csv ("data_original.csv",
#                   index = None,
#                   header=True)
#
# # read csv file and convert
# # into a dataframe object
# df = pd.DataFrame(pd.read_csv("data_original.csv"))


# year, src, dest, country
df = pd.read_csv('data_original.csv')

df.drop(df.columns[[241, 242, 243, 244, 245]], axis=1, inplace=True)

# print(df)

dict = {}

csv_columns = ['Year', 'Country']

for index, row in df.iterrows():
    if pd.isna(row['Type']):
        continue

    year = row['Year']

    if year not in dict:
        dict[year] = {}

    dest = row['Country']

    if dest not in dict[year]:
        dict[year][dest] = {}

    for src in row.keys():

        if src not in ['Year', 'Sort Order', 'Country', 'Notes', 'Code', 'Type', 'Total', 'Other South', 'Other North']:
            if index == 25:
                csv_columns.append(src)
            if not pd.isna(row[src]):
                dict[year][dest][src] = row[src]

# csv_array = []

# save dictionary to a CSV file
# for year in dict.keys():
#     for dest in dict[year].keys():
#         item = {}
#         item['Year'] = year
#         item['Country'] = dest
#         for src in dict[year][dest].keys():
#             item[src] = dict[year][dest][src]
#
#         csv_array.append(item)
#
# csv_file = 'data_parsed.csv'
#
# print(len(csv_array))
#
# try:
#     with open(csv_file, 'w') as csvfile:
#         writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
#         writer.writeheader()
#         for data in csv_array:
#             writer.writerow(data)
# except IOError:
#     print("I/O error")

jsonString = json.dumps(dict)
jsonFile = open("data.json", "w")
jsonFile.write(jsonString)
jsonFile.close()
