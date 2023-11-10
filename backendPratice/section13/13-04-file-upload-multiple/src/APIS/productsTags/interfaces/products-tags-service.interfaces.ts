export interface IProductsTagsServiceBulkInsert {
    //배열안에 객체타입 names:[{name:"1"},{name:"2"}]
    names: {
        name: string;
    }[];
}

export interface IProductsTagsServiceFindByNames {
    tagNames: string[];
}
