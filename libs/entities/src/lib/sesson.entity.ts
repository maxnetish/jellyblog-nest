import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { ISession } from 'connect-typeorm';

@Entity()
export class Session implements ISession {

  @Index()
  @Column('bigint')
  expiredAt = Date.now();

  @PrimaryColumn('varchar', { length: 255 })
  id = '';

  @Column('text')
  json = '';

}
