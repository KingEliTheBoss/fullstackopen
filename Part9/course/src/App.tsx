interface HeaderProps {
  name: string
};

interface CoursePartWithDesc {
  description: string
};

interface CoursePartBase extends CoursePartWithDesc {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase {
  //description: string;
  kind: "basic";
};

interface CoursePartGroup extends Omit<CoursePartBase, "description"> {
  groupProjectCount: number;
  kind: "group";
};

interface CoursePartBackground extends CoursePartBase {
  //description: string;
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartRequirements extends CoursePartBase {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartRequirements;

interface ContentProps {
  courseParts: CoursePart[]
};

interface TotalProps {
  totalExercises: number
};






const Header = (props: HeaderProps) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )
};

const Content = (props: ContentProps) => {
  const bold = {
    fontWeight: "bold",
  };
  const italic = {
    fontStyle: "italic"
  };

  const assertNever = (value: never): never => {
    throw new Error(`Unhandled discrimination union member: ${JSON.stringify(value)}`);
  };

  return (
    <div>
      {props.courseParts.map(cPart => {
        switch (cPart.kind) {
          case "basic":
            return (
              <p>
                <div style={bold}>{cPart.name} {cPart.exerciseCount}</div>
                <div style={italic}>{cPart.description}</div>
              </p>
            );
          case "group":
            return (
              <p>
                <div style={bold}>{cPart.name} {cPart.exerciseCount}</div>
                <div style={italic}>project exercises {cPart.groupProjectCount}</div>
              </p>
            );
          case "background":
            return (
              <p>
                <div style={bold}>{cPart.name} {cPart.exerciseCount}</div>
                <div style={italic}>{cPart.description}</div>
                <div>submit to {cPart.backgroundMaterial}</div>
              </p>
            );
          case "special":
            return (
              <p>
                <div style={bold}>{cPart.name} {cPart.exerciseCount}</div>
                <div style={italic}>{cPart.description}</div>
                <div>required skills: {cPart.requirements.map(r => r.concat(", "))} </div>
              </p>
            );
          default:
            return assertNever(cPart);
        }
      })}
    </div>
  )
};

const Total = (props: TotalProps) => {
  return (
    <p>Number of exercises {props.totalExercises}</p>
  );
};

const App = () => {
  const courseName: string = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unkown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "Typescript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};



export default App;