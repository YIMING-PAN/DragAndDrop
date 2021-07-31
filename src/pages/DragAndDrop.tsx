import React, { useEffect, useState, DragEvent } from "react";
import _ from "lodash";
import { ItemNames, ItemTargetNames } from "../constants/ItemNames";
import { ICoordinates } from "../interfaces/dragAndDrop";
import "../pages/DragAndDrop.scss";

const items: string[] = ["square", "circle", "rectangle", "oval"];

export default function DragAndDrop() {
  const [itemsList, setItemsList]: [string[], any] = useState(items);
  const [matchedItems, setMatchedItems]: [string[], any] = useState([]);
  const [coordinates, setCoordinates]: [ICoordinates[], any] = useState([]);
  const [isAllMatched, setIsAllMatched]: [boolean, any] = useState(false);

  useEffect(() => {
    const targetNodes = document.querySelectorAll("[id^=target_]");
    let coordinatesArray: ICoordinates[] = [];
    targetNodes.forEach((n) => {
      const nodeCoordinates = n.getBoundingClientRect();
      coordinatesArray.push({ x: nodeCoordinates.x, y: nodeCoordinates.y, name: n.id });
    });
    setCoordinates(coordinatesArray);
  }, []);

  useEffect(() => {
    matchedItems.forEach((i) => {
      switch (i) {
        case ItemNames.SQUARE:
          document.getElementById(ItemTargetNames.SQUARE)?.classList.remove("target");
          break;

        case ItemNames.CIRCLE:
          document.getElementById(ItemTargetNames.CIRCLE)?.classList.remove("target");
          break;

        case ItemNames.RECTANGLE:
          document.getElementById(ItemTargetNames.RECTANGLE)?.classList.remove("target");
          break;

        case ItemNames.OVAL:
          document.getElementById(ItemTargetNames.OVAL)?.classList.remove("target");
          break;

        default:
          return;
      }
    });

    const itemsFormListToRemove = itemsList.filter((item) => !matchedItems.includes(item));
    setItemsList(itemsFormListToRemove);

    if (_.isEqual(items.length, matchedItems.length)) {
      setIsAllMatched(true);
    }
  }, [matchedItems]);

  const onDragStart = (ev: DragEvent<HTMLDivElement>, id: string) => {
    ev.dataTransfer.setData("id", id);
  };

  const onDragOver = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
  };

  const handleMatching = (shape: DragEvent<HTMLDivElement>, matchedShape: string, targetName: string) => {
    const targetPostion = coordinates.find((o) => o.name === ItemTargetNames[targetName]);
    if (targetPostion && shape.clientY - targetPostion.y < 80 && shape.clientX - targetPostion.x < 80) {
      setMatchedItems([...matchedItems, matchedShape]);
    }
  };

  const onDrop = (ev: DragEvent<HTMLDivElement>) => {
    const matchedItem = ev.dataTransfer.getData("id");
    const targetName = Object.keys(ItemTargetNames).find((key) => key === matchedItem.toUpperCase());
    if (targetName) {
      handleMatching(ev, matchedItem, targetName);
    }
  };

  const renderItems = () =>
    itemsList.map((i) => <div className={i} key={i} draggable onDragStart={(e) => onDragStart(e, i)}></div>);

  const renderMatchedItems = () => items.map((i) => <div className={`${i} target`} key={i} id={`target_${i}`}></div>);

  const renderSuccessMessage = () => {
    return (
      <>
        <p>Congratulations</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </>
    );
  };

  return (
    <div className="game-container">
      <div className="game-container__title">
        <p>Simple drag and drop game</p>
      </div>
      <div className="game-container__body">
        <div className="game-board">
          <div className="game-board__col">{renderItems()}</div>
          <div className="game-board__col message">{isAllMatched && renderSuccessMessage()}</div>
          <div className="game-board__col" onDragOver={(e) => onDragOver(e)} onDrop={(e) => onDrop(e)}>
            {renderMatchedItems()}
          </div>
        </div>
      </div>
    </div>
  );
}
