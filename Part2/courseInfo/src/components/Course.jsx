const Header = ({ course, id }) => {
    return <h2>{course[id].name}</h2>;
}

const Part = (props) => {
    return <p>{props.name} {props.exercises}</p>;
}

const Content = ({ course, id }) => {
    return (
        <>
            {course[id].parts.map(part =>
                <Part key={part.id} name={part.name} exercises={part.exercises} />
            )}
        </>
    )
}

const Total = ({ course, id }) => {
    const initial = 0;
    const sum = course[id].parts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.exercises
    }, initial);
    return (
        <>
            <p>Number of exercises {sum}</p>
        </>
    )
}

const Course = ({ courses }) => {
    return (
        <div>
            <h1>Web development curriculum</h1>
            <Header course={courses} id={0} />
            <Content course={courses} id={0} />
            <Total course={courses} id={0} />
            <Header course={courses} id={1} />
            <Content course={courses} id={1} />
            <Total course={courses} id={1} />
        </div>
    )
}

export default Course