import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { colors } from '../../global/vars';
import UserNameBox from './UserNameBox';

const Header = ({user}) => {
  const [titleHover, setTitleHover] = useState(false);
  const handleMouseEnter = () => {
    setTitleHover(true);
  }
  const handleMouseLeave = () => {
    setTitleHover(false);
  }

  const styles = {
    nav: {
      display: 'flex',
      height: '8em',
      padding: '0em 2em 0.5em 2em',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      color: titleHover ? colors.accent1 : colors.accent2,
      transition: 'all 0.27s ease'
    },
    span: {
      color: titleHover ? colors.accent2 : colors.accent1,
      transition: 'all 0.27s ease'
    }
  }

  return (
    <nav style={styles.nav}>
      <Link to="/"><h3 style={styles.title} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}><span style={styles.span}>eat</span>code</h3></Link>
      <UserNameBox user={user}/>
    </nav>
  )
}

export default Header