import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { Product } from './product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this); // 클래스 자기자신 등록
    }

    listenTo() {
        return Product; //  이벤트를 수신받을 테이블명
    }

    afterInsert(event: InsertEvent<any>): void | Promise<any> {
        //등록하고 나서 실행될 함수
        console.log(event);
        const id = event.entity.id;
        const name = event.entity.name;
        const description = event.entity.description;
        const price = event.entity.price;
        const isSoldout = event.entity.isSoldout;

        console.log(`${id},${description},${price},${isSoldout}`);
    }

    //  1. 트리거는 언제 사용하면 안될까 ?
    //  트랜잭션으로 연결된 중요한 내용들..

    //  2.  어떤 것들을 사용하면 좋을까 ?
    //  메인 로직에 큰 피해를 안끼치는 로직들(통계 계산하기, 로그 쌓아놓기)
}
