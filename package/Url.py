base_youtube = "https://youtu.be/"

def url_id(url):
    if "youtu.be" in url:
        clean1 = url.rsplit("?", 10)[0]
        clean2 = clean1.rsplit("/", 1)[1]
        return clean2
    if "/watch?v=" in url:
        clean1 = url.rsplit("v=", 1)[1]
        clean2 = clean1.rsplit("&", 10)[0]
        return clean2
    else:
        clean1 = url.rsplit("&", 10)[1]
        clean2 = clean1.rsplit("v=", 1)[1]
        return clean2

def url_cleansing(url):
    return base_youtube + url_id(url)