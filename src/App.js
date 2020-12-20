import React from 'react';
import { Button } from 'reactstrap';
import { Route } from "react-router-dom";
import Common_modal from './Common_modal';
import './App.scss';

function App(props) {
  return (
    <div className="d-flex align-items-center justify-content-center App">
      <div className='d-flex align-items-center justify-content-center w-100'>
        <Button className='button-a' onClick={() => props.history.push('modal_a')}>Button A</Button>
      </div>
      <div className='d-flex align-items-center justify-content-center w-100'>
        <Button className='button-b' onClick={() => props.history.push('modal_b')}>Button B</Button>
      </div>
      <Route
        path={`/modal_a`}
        render={() => {
          return (
            <Common_modal
              modal_Id={1}
              {...props}
            />
          );
        }}
      />
      <Route
        path={`/modal_b`}
        render={() => {
          return (
            <Common_modal
              modal_Id={2}
              {...props}
            />
          );
        }}
      />
    </div >
  );
}

export default App;
