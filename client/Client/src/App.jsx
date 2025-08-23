import './App.css'
import Nav from './Components/Nav/Nav'
import { FloatingElements } from './components/magicui/floating-elements'
import { GradientText } from './components/magicui/gradient-text'
import { AnimatedText } from './components/magicui/animated-text'

function App() {

 

  return (
    <FloatingElements className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <GradientText from="from-blue-600" via="via-purple-600" to="to-indigo-600">
              <AnimatedText text="Let's Make Some Notes 📒" animation="slideUp" />
            </GradientText>
          </h1>
        </div>
        <Nav />
      </div>
    </FloatingElements>
  )
}

export default App
