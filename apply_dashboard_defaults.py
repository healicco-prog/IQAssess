import os
import re

app_tsx_path = os.path.join("frontend", "src", "App.tsx")
with open(app_tsx_path, "r", encoding="utf-8") as f:
    content = f.read()

helper = """export const getDashboardSetting = (key: string, def: string) => {
  try {
    const d = JSON.parse(localStorage.getItem('iqassess_dashboard_config') || '{}');
    return d[key] || def;
  } catch(e) {
    return def;
  }
};

export default function App() {"""

if "export const getDashboardSetting" not in content:
    content = content.replace("export default function App() {", helper)

replacements = [
  ("omrInstitutionName", "institution"),
  ("mcqInstitution", "institution"),
  ("adsInstitution", "institution"),
  ("bpdsInstitution", "institution"),
  ("qpInstitutionName", "institution"),
  ("newRubricInstitution", "institution"),
  ("essayBuilderInstitution", "institution"),
  ("mcqBuilderInstitution", "institution"),
  
  ("baCourse", "course"),
  ("itemAnalysisCourse", "course"),
  ("currCourseName", "course"),
  ("bpdsCourse", "course"),
  ("newRubricCourse", "course"),
  ("essayBuilderCourse", "course"),
  ("mcqBuilderCourse", "course"),

  ("baSubject", "subject"),
  ("mcqSubjectTitle", "subject"),
  ("bpSubject", "subject"),
  ("adsSubject", "subject"),
  ("bpdsSubject", "subject"),
  ("qpSubject", "subject"),
  ("newRubricSubject", "subject"),
  ("essayBuilderSubject", "subject"),
  ("mcqBuilderSubject", "subject"),

  ("baTopic", "topic"),
  ("mcqTopicText", "topic"),
  ("mcqTopic", "topic"),
  ("adsTopic", "topic"),
  ("bpdsTopic", "topic"),
  ("essayBuilderTopic", "topic"),
  ("mcqBuilderTopic", "topic")
]

for stateName, key in replacements:
    setterName = "set" + stateName[0].upper() + stateName[1:]
    # Match const [state, setState] = useState<string>('val')
    # Use re.sub with a function to preserve the default value if it's not already wrapped
    pattern = r"const \[" + stateName + r", " + setterName + r"\] = useState(?:<string>)?\((.*?)\);"
    
    def replacer(match):
        p1 = match.group(1)
        if "getDashboardSetting" in p1 or "getInitialHistory" in p1:
            return match.group(0)
        return f"const [{stateName}, {setterName}] = useState<string>(getDashboardSetting('{key}', {p1}));"

    content = re.sub(pattern, replacer, content)

with open(app_tsx_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully replaced App.tsx state variables.")
