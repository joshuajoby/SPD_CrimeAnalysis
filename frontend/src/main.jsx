import ErrorBoundary from './components/ErrorBoundary.jsx'

// DEBUG: Confirm JS Main Entry
console.log("Main.jsx is running");
// window.alert("System Check: Frontend is loading..."); 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
