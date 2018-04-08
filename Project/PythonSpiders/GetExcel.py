import urllib.request
from pyquery import PyQuery as pq

# 国债数据下载页面网址
url = 'http://www.chinabond.com.cn/cb/cn/zzsj/cywj/syqx/sjxz/zzgzqx/list.shtml'

content = urllib.request.urlopen(url)
html = content.read().decode("utf-8")
query = pq(html)
#title = query('.unlock>a')[0].attrib['title']
href = query('unlock>a')[0].attrib['href']
#print(title)
print(href)