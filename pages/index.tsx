'use client';

import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

import cx from 'classnames';

import styles from './styles.module.css';
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
  switchElements,
} from '../src/utils/array';
import { getImageName } from '../src/utils/name';
import StatsPage from './stats';

const INITIAL_RACK_DATA = {
  ['rack-1']: [
    `b-${uuidv4()}`,
    `c-${uuidv4()}`,
    `d-${uuidv4()}`,
    `e-${uuidv4()}`,
    `f-${uuidv4()}`,
    `g-${uuidv4()}`,
    `h-${uuidv4()}`,
    `b-${uuidv4()}`,
    `c-${uuidv4()}`,
    `d-${uuidv4()}`,
    `e-${uuidv4()}`,
    `f-${uuidv4()}`,
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

    if (
      source.droppableId === destination?.droppableId &&
      (result.combine === undefined || result.combine === null)
    ) {
      // Déplacement d'un article sur le même portant
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
        // Déplacement d'un article sur un autre portant
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
        // Interversion de deux articles
        setState((currentState) => {
          const {
            state: { dragOverId },
            data: currentRackData,
          } = currentState;
          // Articles sur le même portant
          if (dragOverId !== null && dragOverId !== undefined) {
            if (result.combine?.droppableId === source.droppableId) {
              const sourceRack =
                currentRackData[source.droppableId as unknown as rackIds];
              const firstEltIdx = source.index;
              const secondElt = dragOverId;
              const secondEltIdx = getValueIndex(sourceRack, secondElt);

              return {
                ...currentState,
                data: {
                  ...currentState.data,
                  [source.droppableId]: switchElements(
                    sourceRack,
                    firstEltIdx,
                    secondEltIdx
                  ),
                },
              };
            } else {
              // Articles sur deux portants différents
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

              return {
                ...currentState,
                data: {
                  ...currentState.data,
                  [source.droppableId]: updatedSourceRack,
                  [result.combine?.droppableId ?? '']: updatedDestinationRack,
                },
              };
            }
          } else {
            return currentState;
          }
        });
      }
    }
  };

  return (
    <div className={styles['page-layout']}>
      <div className={styles.main}>
        <div>
          <div className='flex flex-row gap-4 py-2'>
            {Object.keys(state.data).map((rackId) => (
              <button
                key={rackId}
                className={styles['rack-selector']}
                onClick={() => setSelectedRack(rackId as unknown as rackIds)}
              >
                Rack {rackId.split('-')[1]}
              </button>
            ))}
          </div>
          <div className={styles['main-rack']}>
            <div
              style={{
                width: '711px',
                height: '519px',
                position: 'relative',
                border: '1px solid black',
                background: '#F5F5F5',
              }}
            >
              {[...state.data[selectedRack]].reverse().map((pId, idx) => (
                <Image
                  key={`${selectedRack}-bigrack-${pId}`}
                  src={`/photos/photo-${getImageName(pId)}.png`}
                  alt='vêtement'
                  height={519}
                  width={519 / 1.499}
                  style={{
                    position: 'absolute',
                    top: '0px',
                    bottom: '0px',
                    right: `${-90 + 45 * idx}px`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-8 p-16'>
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
                      className='flex flex-row gap-8 mt-8 overflow-x-auto'
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
      <div className={styles['sidebar']}>
        <StatsPage />
      </div>
    </div>
  );
}
