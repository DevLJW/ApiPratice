const fetchData = async () => {
    console.time('===개별 Promise 각각 ===');
    await new Promise((resolver, reject) => {
        setTimeout(() => {
            resolver('성공');
        }, 2000);
    });

    await new Promise((resolver, reject) => {
        setTimeout(() => {
            resolver('성공');
        }, 3000);
    });

    await new Promise((resolver, reject) => {
        setTimeout(() => {
            resolver('성공');
        }, 1000);
    });

    console.timeEnd('===개별 Promise 각각 ===');
};

const fetchData2 = async () => {
    console.time('===한번에 Promise.all ===');
    const results = await Promise.all([
        new Promise((resolver, reject) => {
            setTimeout(() => {
                resolver('성공');
            }, 2000);
        }),

        new Promise((resolver, reject) => {
            setTimeout(() => {
                resolver('성공');
            }, 3000);
        }),

        new Promise((resolver, reject) => {
            setTimeout(() => {
                resolver('성공');
            }, 1000);
        }),
    ]);
    console.log(results);
    console.timeEnd('===한번에 Promise.all ===');
};

fetchData();
fetchData2();
