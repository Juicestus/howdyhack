
d = {
  "Basic Syntax": {
    "Comments": {},
    "Indentation": {},
    "Print function": {}
  },
  "Variables and Data Types": {
    "Variable assignment": {},
    "Understanding data types": [
      "integers",
      "floats",
      "strings",
      "booleans"
    ]
  },
  "Basic Operators": {
    "Arithmetic operators": {},
    "Comparison operators": {},
    "Logical operators": {},
    "Assignment operators": {},
    "Bitwise operators": {}
  },
  "Working with Strings": {
    "String literals": {},
    "String methods": {},
    "String concatenation and formatting": {},
    "Slicing and indexing strings": {}
  },
  "Data Structures": {
    "Lists": {},
    "List methods": {},
    "Tuples": {},
    "Sets": {},
    "Dictionaries": {},
    "Dictionary methods": {}
  },
  "Flow Control": {
    "Conditional statements (if/else/elif)": {},
    "Looping constructs (for/while)": {},
  },
  "Functions": {
    "Defining functions": {},
    "Function arguments and return values": {},
    "Scope": {},
    "Lambda functions": {}
  },
  "Exception Handling": {
    "Understanding try/except blocks": {},
    "Catching specific exceptions": {},
    "Using finally": {}
  },
  "Modules and Packages": {
    "Importing modules": {},
    "Standard library modules": {},
    "Writing and using custom modules": {},
    "Installing packages using pip": {}
  },
  "File Handling": {
    "Reading from and writing to files": {},
    "Working with different file modes": {},
    "Handling file exceptions": {}
  },
  "Object-Oriented Programming": {
    "Classes and objects": {},
    "Instance variables and methods": {},
    "Class variables and methods": {},
    "Inheritance": {},
    "Polymorphism": {},
    "Encapsulation and abstraction": {}
  },
  "Advanced Data Structures": {
    "Stacks": {},
    "Queues": {},
    "Linked lists": {},
    "Trees": {},
    "Graphs": {}
  }
}
 
f = {}
i = 1
for k, v in d.items():
  
  st = {}
  j = 1
  for sk, sv in v.items():
    st[f"{i}.{j} {sk}"] = {
      "name": sk,
      "completed": False,
      "locked": False,
      "tasks": []
    }
    j+=1
    
  f[f"{i} {k}"] = {
    "name": k,
    "subtopics": st
  }
  i+=1
  
import json 
print(json.dumps(f))