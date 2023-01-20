import Image from 'next/image';
import styles from './DragNDropCard.module.css';
import cx from 'classnames';
import { forwardRef } from 'react';
import {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';

interface DragNDropCardProps {
  imgId: string;
  imgRef: string;
  droppableProvided: DroppableProvided;
  droppableSnapshot: DroppableStateSnapshot;
  draggableProvided: DraggableProvided;
  draggableSnapshot: DraggableStateSnapshot;
}

export const DragNDropCard = ({
  imgId,
  imgRef,
  droppableProvided,
  droppableSnapshot,
  draggableProvided,
  draggableSnapshot,
}: DragNDropCardProps) => {
  console.log(draggableSnapshot);
  return (
    <div
      ref={draggableProvided.innerRef}
      {...draggableProvided.draggableProps}
      {...draggableProvided.dragHandleProps}
      style={{
        width: '102px',
        height: '166px',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        ...draggableProvided.draggableProps.style,
      }}
    >
      <Image
        src={`/photos/photo-${imgId}.png`}
        alt='vêtement'
        className={cx(styles['drag-n-drop-card-img'], 'rounded-t-2')}
        width={100}
        height={139}
      />
      <p className={styles['drag-n-drop-card-title']}>
        {draggableSnapshot.combineWith || draggableSnapshot.combineTargetFor
          ? '&#8644;'
          : imgRef}
      </p>
    </div>
  );
};
