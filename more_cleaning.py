import pandas as pd
import calendar
import datetime

def custom_fill(row):
    _, num_days = calendar.monthrange(row['year'], row['month'])
    last_day = datetime.date(row['year'], row['month'], num_days)
    return last_day.strftime('%Y-%m-%d')

df_senate = pd.read_csv("data/Senate/clean_senate.xz",compression='xz',na_filter=False,index_col = 0,low_memory=False)
df_senate["date"] = df_senate.apply(lambda row: custom_fill(row) if row["date"] == "" else pd.to_datetime(row["date"],format="%Y-%m-%d"), axis=1)
df_senate["date"] = pd.to_datetime(df_senate["date"])
df_senate.to_csv(path_or_buf='clean_senate.xz', sep=',', compression='xz',chunksize=10000)

# df_chamber = pd.read_csv("data/Chamber/clean_deputies.xz",compression='xz',na_filter=False,index_col = 0,low_memory=False)
# df_chamber["issue_date"] = pd.to_datetime(df_chamber["issue_date"],format="%Y-%m-%d")
# df_chamber.to_csv(path_or_buf='clean_deputies.xz', sep=',', compression='xz',chunksize=10000)
