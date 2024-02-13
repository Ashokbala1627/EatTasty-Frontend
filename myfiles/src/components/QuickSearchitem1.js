import React from "react";

function QuickSearchItem1(props) {
  return (
    <div className="d-flex border border-4 rounded-3 shadow bg-body rounded">
      <img
        src={props.img}
        alt="food images"
        style={{ width: "150px", height: "150px" }}
      />
      <div className="px-2 py-4">
        <h4 className="title">{props.title}</h4>
        <h6 className="detail">{props.detail}</h6>
      </div>
    </div>
  );
}

export default QuickSearchItem1;
