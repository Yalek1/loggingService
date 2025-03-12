import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ErrorLog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  err_code!: string;

  @Column()
  err_user_code!: string; 

  @Column()
  err_message!: string;

  @Column({ type: 'text', nullable: true })
  err_stack_trace!: string;

  @Column({ nullable: true })
  err_method!: string;

  @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
  err_date!: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  err_endpoint!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  err_severity!: string;
}
