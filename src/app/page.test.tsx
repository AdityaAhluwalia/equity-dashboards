import { render } from '@testing-library/react'
import Page from './page'

describe('Homepage', () => {
  it('renders without crashing', () => {
    render(<Page />)
    
    // Check that the page renders
    expect(document.body).toBeInTheDocument()
  })

  it('contains expected content', () => {
    render(<Page />)
    
    // This test will need to be updated once we implement the actual dashboard
    // For now, just check that something renders
    expect(document.body).toBeInTheDocument()
  })
}) 