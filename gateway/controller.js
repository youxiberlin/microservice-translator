const getData = async (req, res) => {
		res.send({ data: 'hello world' });
};


module.exports = {
	getData,
};
