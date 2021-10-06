import React from "react";
import { NavStyle } from './styles';

function Nav() {

  function showNavigation() {
          return (
        <div>
           <button>Signup</button>
           <button> Login</button>
        </div>
      );
    }
  return (

  <NavStyle>
      <div className="logo">
        <a href="/">By m.o.m.</a>
      </div>
      <div className="tabs">{showNavigation()}</div>
  </NavStyle>
    
  );
}

export default Nav;