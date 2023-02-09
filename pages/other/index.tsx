'use client';

import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { DragNDropCard } from '../../src/components/DragNDropCard/DragNDropCard';
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
} from '../../src/utils/array';
import { getImageName } from '../../src/utils/name';

const INITIAL_RACK_DATA = {
  ['rack-1']: [
    `b-${uuidv4()}`,
    `c-${uuidv4()}`,
    `d-${uuidv4()}`,
    `e-${uuidv4()}`,
    `f-${uuidv4()}`,
    `g-${uuidv4()}`,
    `h-${uuidv4()}`,
  ],
  ['rack-2']: [
    `d-${uuidv4()}`,
    `e-${uuidv4()}`,
    `f-${uuidv4()}`,
    `g-${uuidv4()}`,
    `h-${uuidv4()}`,
    `a-${uuidv4()}`,
    `c-${uuidv4()}`,
    `b-${uuidv4()}`,
  ],
  ['rack-3']: [
    `a-${uuidv4()}`,
    `c-${uuidv4()}`,
    `e-${uuidv4()}`,
    `g-${uuidv4()}`,
  ],
  ['rack-4']: [
    `b-${uuidv4()}`,
    `d-${uuidv4()}`,
    `f-${uuidv4()}`,
    `h-${uuidv4()}`,
  ],
  ['rack-5']: [
    `a-${uuidv4()}`,
    `e-${uuidv4()}`,
    `b-${uuidv4()}`,
    `f-${uuidv4()}`,
    `c-${uuidv4()}`,
    `d-${uuidv4()}`,
    `g-${uuidv4()}`,
  ],
  ['rack-6']: [
    `a-${uuidv4()}`,
    `b-${uuidv4()}`,
    `c-${uuidv4()}`,
    `d-${uuidv4()}`,
    `e-${uuidv4()}`,
    `f-${uuidv4()}`,
    `g-${uuidv4()}`,
    `h-${uuidv4()}`,
  ],
} satisfies Record<string, `${string}-${string}`[]>;
type rackIds = keyof typeof INITIAL_RACK_DATA;

interface STATE {
  data: typeof INITIAL_RACK_DATA;
  state: {
    dragOverId: string | undefined;
  };
}

const INITIAL_STATE: STATE = {
  state: { dragOverId: undefined },
  data: INITIAL_RACK_DATA,
};

export default function Home() {
  const [state, setState] = useState<STATE>(INITIAL_STATE);
  const [selectedRack, setSelectedRack] = useState<rackIds>('rack-1');
  const [winReady, setWinReady] = useState(false);

  useEffect(() => {
    setWinReady(true);
  }, []);

  if (!winReady) {
    return null;
  }

  const handleDragUpdate: OnDragUpdateResponder = ({ combine }) => {
    setState((currentState) => ({
      ...currentState,
      state: { dragOverId: combine ? combine?.draggableId : undefined },
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

            const destinationValue = dragOverId;
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
      }
    }
  };

  return (
    <div>
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
                src={`/photos/photo-${getImageName(pId)}.png`}
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
                      src={`/photos/photo-${getImageName(pId)}.png`}
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
                        <Draggable key={pId} draggableId={pId} index={idx}>
                          {(draggableProvided, draggableSnapshot) => (
                            <div>
                              <DragNDropCard
                                key={pId}
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
    </div>
  );
}
