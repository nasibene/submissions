const Header = (props) => {
  return (
    <div>
      <p>{props.course}</p>
    </div>
  )
}

const Part = (props) => {
  return (
     <div>
      <p>{props.part} {props.exercise}</p>
     </div>
    )
}

const Content = (props) => {
  const t = props.parts
  return (
    <div>
      <Part part={t[0].name} exercise={t[0].exercises}/>
      <Part part={t[1].name} exercise={t[1].exercises}/>
      <Part part={t[2].name} exercise={t[2].exercises}/>
    </div>
  )
}

const Total = (props) => {
  const t = props.parts
  const total = t[0].exercises+t[1].exercises+t[2].exercises
  return (
      <div>
        <p>Number of exercises {total}</p>
      </div>
    )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App