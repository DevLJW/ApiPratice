import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; //typeorm : 변환도구

@Entity() //테이블로 변환하기
export class ProductSaleslocation {
    @PrimaryGeneratedColumn('uuid') //기본키로 변환된다.
    id: string;
    @Column() //테이블의 컬럼으로 변환
    address: string;
    @Column() //테이블의 컬럼으로 변환
    addressDetail: string;
    @Column({ type: 'decimal', precision: 9, scale: 6 }) //테이블의 컬럼으로 변환
    lat: string;
    @Column({ type: 'decimal', precision: 9, scale: 6 }) //테이블의 컬럼으로 변환
    lng: string;
    @Column() //테이블의 컬럼으로 변환
    meetingTime: Date;
}
