import urllib.request
import re

def get_title(course_id):
    url = f"https://elearning.fao.org/course/view.php?id={course_id}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        title_match = re.search(r'<title>(.*?)</title>', html)
        if title_match:
            title = title_match.group(1).strip()
            if "Course:" in title or title != "FAO elearning Academy":
                print(f"ID: {course_id} - Title: {title}")
                return title
    except Exception as e:
        pass
    return None

print("Searching for FAO courses...")
for i in range(300, 320):
    get_title(i)
