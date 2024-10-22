const paginatemsg = (massive, msgid, climsg, bd, page = 0) => {
  const len = massive.length;
  if (len <= 5) {
    return massive;
  }
  const strelki = [
    { text: "⬅️", callback_data: `${msgid}%${bd}%${climsg}%${page - 1}` },
    { text: `${page + 1}\/${Math.ceil(len / 5)}`, callback_data: "someshit" },
    { text: "➡️", callback_data: `${msgid}%${bd}%${climsg}%${page + 1}` },
  ];
  const maspage = massive.slice(5 * page, page * 5 + 5);

  maspage.push(strelki);
  return maspage;
};

export default paginatemsg;
