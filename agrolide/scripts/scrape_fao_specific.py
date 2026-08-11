import urllib.request
import re

ids = [439, 437, 460, 435, 579]

for course_id in ids:
    url = f"https://elearning.fao.org/course/view.php?id={course_id}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        title_match = re.search(r'<title>(.*?)</title>', html)
        if title_match:
            title = title_match.group(1).strip()
            print(f"ID {course_id}: {title}")
    except Exception as e:
        print(f"Error for ID {course_id}: {e}")
