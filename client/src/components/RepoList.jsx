import React from 'react';

function RepoItem (props) {
  const {row} = props;
  const style = {
    // color: 'green',
    // border: '1px solid black',
  }
  return (
    <div className='rowdata' style={style}> {row.name} {row.git_url} </div>
  );
}

const RepoList = (props) => {
  // {props.map(item => <RepoItem item = {item} />)}
  
  return (
    <div>
      <h4> Repo List Component </h4>
      There are {props.repos.length} repos.
      <div>
      {props.repos.map((item, key) => <RepoItem key={key} row={item} />)}
      </div>
    </div>

  );
}

export default RepoList;