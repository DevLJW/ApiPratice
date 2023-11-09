const fetchData = async () => {
    //API 보내기 요청
    const result = await new Promise((su, fa) => {
        setTimeout(() => {
            try {
                console.log('이미지 받아왔다.');
                su('강아지.jpg');
            } catch (error) {}
        }, 5000); //  5초뒤에 이미지 받아온다.
    });

    console.log(result);
};

fetchData();
