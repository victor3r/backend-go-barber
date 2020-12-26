import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('notifications')
class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;
