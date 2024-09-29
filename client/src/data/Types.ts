
export enum State {

    DECIDING_TASKS = "Deciding Tasks",
    EXPLAINING_TASKS = "Explaining Tasks",
    ASKING_QUESTION = "Asking Questions",
    CHECKING_RESPONSE_MCQ = "Checking Response (MCQ)",
    CHECKING_RESPONSE_CODE = "Checking Response (Code)",
    GIVING_FEEDBACK_NEG = "Giving Feedback (Correct)",
    GIVING_FEEDBACK_POS = "Giving Feedback (Incorrect)",
    MODULE_COMPLETE = "Module Completed"
}

type ChallangeType = "multiple-choice" | "coding-challenge";

export interface Task {
    name: string;
    type: ChallangeType;
    id: number,
    mastered: boolean
}

export interface Subtopic {
    name: string;
    completed: boolean;
    locked: boolean;
    tasks: Task[];
    taskid: number,
}

export interface Subtopics {
    [key: string]: Subtopic;
}

export interface Topic {
    name: string;
    subtopics: Subtopics;
}

export interface Topics {
    [key: string]: Topic;
}

export const defaultUserData: Topics = {
    "1 Basic Syntax": {
        "name": "Basic Syntax",
        "subtopics": {
            "1.1 Comments": {
                "name": "Comments",
                "completed": false,
                "locked": false, "taskid": -1,
                "tasks": []
            },
            "1.2 Indentation": {
                "name": "Indentation",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "1.3 Print function": {
                "name": "Print function",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "2 Variables and Data Types": {
        "name": "Variables and Data Types",
        "subtopics": {
            "2.1 Variable assignment": {
                "name": "Variable assignment",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "2.2 Understanding data types": {
                "name": "Understanding data types",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "3 Basic Operators": {
        "name": "Basic Operators",
        "subtopics": {
            "3.1 Arithmetic operators": {
                "name": "Arithmetic operators",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "3.2 Comparison operators": {
                "name": "Comparison operators",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "3.3 Logical operators": {
                "name": "Logical operators",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "3.4 Assignment operators": {
                "name": "Assignment operators",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "3.5 Bitwise operators": {
                "name": "Bitwise operators",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "4 Working with Strings": {
        "name": "Working with Strings",
        "subtopics": {
            "4.1 String literals": {
                "name": "String literals",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "4.2 String methods": {
                "name": "String methods",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "4.3 String concatenation and formatting": {
                "name": "String concatenation and formatting",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "4.4 Slicing and indexing strings": {
                "name": "Slicing and indexing strings",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "5 Data Structures": {
        "name": "Data Structures",
        "subtopics": {
            "5.1 Lists": {
                "name": "Lists",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "5.2 List methods": {
                "name": "List methods",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "5.3 Tuples": {
                "name": "Tuples",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "5.4 Sets": {
                "name": "Sets",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "5.5 Dictionaries": {
                "name": "Dictionaries",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "5.6 Dictionary methods": {
                "name": "Dictionary methods",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "6 Flow Control": {
        "name": "Flow Control",
        "subtopics": {
            "6.1 Conditional statements (if/else/elif)": {
                "name": "Conditional statements (if/else/elif)",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "6.2 Looping constructs (for/while)": {
                "name": "Looping constructs (for/while)",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "7 Functions": {
        "name": "Functions",
        "subtopics": {
            "7.1 Defining functions": {
                "name": "Defining functions",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "7.2 Function arguments and return values": {
                "name": "Function arguments and return values",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "7.3 Scope": {
                "name": "Scope",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "7.4 Lambda functions": {
                "name": "Lambda functions",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "8 Exception Handling": {
        "name": "Exception Handling",
        "subtopics": {
            "8.1 Understanding try/except blocks": {
                "name": "Understanding try/except blocks",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "8.2 Catching specific exceptions": {
                "name": "Catching specific exceptions",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "8.3 Using finally": {
                "name": "Using finally",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "9 Modules and Packages": {
        "name": "Modules and Packages",
        "subtopics": {
            "9.1 Importing modules": {
                "name": "Importing modules",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "9.2 Standard library modules": {
                "name": "Standard library modules",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "9.3 Writing and using custom modules": {
                "name": "Writing and using custom modules",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "9.4 Installing packages using pip": {
                "name": "Installing packages using pip",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "10 File Handling": {
        "name": "File Handling",
        "subtopics": {
            "10.1 Reading from and writing to files": {
                "name": "Reading from and writing to files",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "10.2 Working with different file modes": {
                "name": "Working with different file modes",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "10.3 Handling file exceptions": {
                "name": "Handling file exceptions",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "11 Object-Oriented Programming": {
        "name": "Object-Oriented Programming",
        "subtopics": {
            "11.1 Classes and objects": {
                "name": "Classes and objects",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "11.2 Instance variables and methods": {
                "name": "Instance variables and methods",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "11.3 Class variables and methods": {
                "name": "Class variables and methods",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "11.4 Inheritance": {
                "name": "Inheritance",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "11.5 Polymorphism": {
                "name": "Polymorphism",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "11.6 Encapsulation and abstraction": {
                "name": "Encapsulation and abstraction",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    },
    "12 Advanced Data Structures": {
        "name": "Advanced Data Structures",
        "subtopics": {
            "12.1 Stacks": {
                "name": "Stacks",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "12.2 Queues": {
                "name": "Queues",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "12.3 Linked lists": {
                "name": "Linked lists",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "12.4 Trees": {
                "name": "Trees",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            },
            "12.5 Graphs": {
                "name": "Graphs",
                "completed": false,
                "locked": true, "taskid": -1,
                "tasks": []
            }
        }
    }
}