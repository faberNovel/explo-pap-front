import React, { useEffect } from 'react';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { DragNDropCard } from '../src/components/DragNDropCard/DragNDropCard';
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
  OnDragUpdateResponder,
} from 'react-beautiful-dnd';
import {
  addElementToIndex,
  getValueIndex,
  moveValueToIndex,
  removeElementToIndex,
} from '../src/utils/array';

const INITIAL_RACK_DATA = {
  ['rack-1']: ['b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['rack-2']: ['d', 'e', 'f', 'g', 'h', 'a', 'c', 'b'],
  ['rack-3']: ['a', 'c', 'e', 'g'],
  ['rack-4']: ['b', 'd', 'f', 'h'],
  ['rack-5']: ['a', 'e', 'b', 'f', 'c', 'd', 'g'],
  ['rack-6']: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
};
type rackIds = keyof typeof INITIAL_RACK_DATA;

interface STATE {
  data: typeof INITIAL_RACK_DATA;
  state: {
    dragOverId: string | null | undefined;
  };
}

const INITIAL_STATE: STATE = {
  state: { dragOverId: undefined },
  data: INITIAL_RACK_DATA,
};

export default function Home() {
  const [state, setState] = useState<STATE>(INITIAL_STATE);
  const [selectedRack, setSelectedRack] = useState<rackIds>('rack-1');
  const [winReady, setwinReady] = useState(false);

  useEffect(() => {
    setwinReady(true);
  }, []);

  if (!winReady) {
    return null;
  }

  const handleDragUpdate: OnDragUpdateResponder = ({ combine }) => {
    setState((currentState) => ({
      ...currentState,
      state: { dragOverId: combine ? combine?.draggableId : combine },
    }));
  };

  const handleOnDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    if (source.droppableId === destination?.droppableId) {
      setState((currentState) => {
        const { data: currentRackData } = currentState;
        const modifiedRack =
          currentRackData[source.droppableId as unknown as rackIds];
        const updatedRack = moveValueToIndex(
          modifiedRack,
          modifiedRack[source.index],
          destination.index
        );

        return {
          ...currentState,
          data: {
            ...currentRackData,
            [source.droppableId]: updatedRack,
          },
        };
      });
    } else {
      if (
        (result.combine === undefined || result.combine === null) &&
        destination !== undefined &&
        destination !== null
      ) {
        setState((currentState) => {
          const { data: currentRackData } = currentState;
          const destinationRack =
            currentRackData[destination.droppableId as unknown as rackIds];
          const sourceRack =
            currentRackData[source.droppableId as unknown as rackIds];

          const elt = sourceRack[source.index];

          return {
            ...currentState,
            data: {
              ...currentRackData,
              [source.droppableId]: removeElementToIndex(
                sourceRack,
                source.index
              ),
              [destination.droppableId]: addElementToIndex(
                destinationRack,
                elt,
                destination.index
              ),
            },
          };
        });
      } else if (result.combine !== undefined && result.combine !== null) {
        console.log('combining');
        setState((currentState) => {
          const {
            state: { dragOverId },
            data: currentRackData,
          } = currentState;
          if (dragOverId !== null && dragOverId !== undefined) {
            const destinationRack =
              currentRackData[
                result.combine?.droppableId as unknown as rackIds
              ];
            const sourceRack =
              currentRackData[source.droppableId as unknown as rackIds];

            const destinationValue = dragOverId.split('-')[2];
            const destinationIndex = getValueIndex(
              destinationRack,
              destinationValue
            );
            const sourceElt = sourceRack[source.index];

            const tempDestinationRack = removeElementToIndex(
              destinationRack,
              destinationIndex
            );
            const tempSourceRack = removeElementToIndex(
              sourceRack,
              source.index
            );
            const updatedDestinationRack = addElementToIndex(
              tempDestinationRack,
              sourceElt,
              destinationIndex
            );
            const updatedSourceRack = addElementToIndex(
              tempSourceRack,
              destinationValue,
              source.index
            );
            console.log({
              sourceElt,
              destinationValue,
              sourceRack,
              tempSourceRack,
              updatedSourceRack,
              destinationRack,
              tempDestinationRack,
              updatedDestinationRack,
            });
            return {
              ...currentState,
              data: {
                ...currentState.data,
                [source.droppableId]: updatedSourceRack,
                [result.combine?.droppableId ?? '']: updatedDestinationRack,
              },
            };
          } else {
            return currentState;
          }
        });
        // setRackData((currentRackData) => {
        //   const destinationRack =
        //     currentRackData[result.combine. combine.droppableId as unknown as rackIds];
        //   const sourceRack =
        //     currentRackData[source.droppableId as unknown as rackIds];

        //   const elt = sourceRack[source.index];
        //   const updatedSourceRack = [...sourceRack];
        //   const updatedDestinationRack = [...destinationRack];
        //   updatedSourceRack.splice(source.index, 1);
        //   updatedDestinationRack.splice(destination.index, 0, elt);

        //   return {
        //     ...currentRackData,
        //     [source.droppableId]: updatedSourceRack,
        //     [destination.droppableId]: updatedDestinationRack,
        //   };
        // });
      }
    }
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles['main-rack']}>
          <div
            style={{
              width: '440px',
              height: '296px',
              position: 'relative',
              border: '1px solid black',
              background: 'ligthgrey',
            }}
          >
            {state.data[selectedRack].map((pId, idx) => (
              <Image
                key={`${selectedRack}-bigrack-${pId}`}
                src={`/photos/photo-${pId}.png`}
                alt='vêtement'
                height={296}
                width={296}
                style={{
                  position: 'absolute',
                  top: '0px',
                  bottom: '0px',
                  right: `${-90 + 30 * idx}px`,
                }}
              />
            ))}
          </div>
        </div>
        <div className={styles['rack-selector']}>
          {Object.keys(state.data).map((rackId) => (
            <div
              key={rackId}
              style={{
                width: '153px',
                height: '93px',
                position: 'relative',
                border: '1px solid black',
                background: 'ligthgrey',
              }}
              className={styles.thumbnail}
            >
              <button
                onClick={() => setSelectedRack(rackId as unknown as rackIds)}
              >
                {state.data[rackId as unknown as rackIds].map((pId, idx) => (
                  <React.Fragment key={`${rackId}-thumbnail-${pId}`}>
                    <Image
                      src={`/photos/photo-${pId}.png`}
                      alt='vêtement'
                      height={93}
                      width={93}
                      style={{
                        position: 'absolute',
                        top: '0px',
                        bottom: '0px',
                        right: `${-25 + 10 * idx}px`,
                      }}
                    />
                  </React.Fragment>
                ))}
                <p className={styles['rack-count']}>
                  {rackId.split('-')[1]} sur {Object.keys(state.data).length}
                </p>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-8 mt-8'>
        <DragDropContext
          onDragEnd={handleOnDragEnd}
          onDragUpdate={handleDragUpdate}
        >
          {Object.keys(state.data).map((rackId) => (
            <Droppable
              droppableId={rackId}
              key={rackId}
              direction='horizontal'
              isCombineEnabled
            >
              {(droppableProvided, droppableSnapshot) => (
                <>
                  <div
                    className='flex flex-row gap-8 mt-8'
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {state.data[rackId as unknown as rackIds].map(
                      (pId, idx) => (
                        <Draggable
                          key={`${rackId}-${pId}`}
                          draggableId={`${rackId}-${pId}-${idx}`}
                          index={idx}
                        >
                          {(draggableProvided, draggableSnapshot) => (
                            <div>
                              <DragNDropCard
                                key={`${rackId}-${pId}`}
                                imgId={pId}
                                imgRef={pId}
                                droppableProvided={droppableProvided}
                                droppableSnapshot={droppableSnapshot}
                                draggableProvided={draggableProvided}
                                draggableSnapshot={draggableSnapshot}
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    )}
                    {droppableProvided.placeholder}
                  </div>
                </>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </>
  );
}
