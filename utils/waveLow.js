function objKeySort(arys) {
  var newkey = Object.keys(arys).sort();
  var newObj = {};
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = arys[newkey[i]];
  }
  return newObj;
}

module.exports =  function waveLow($list, key) {
  let $down = {};
  let $length = $list.length;
  let min = $length < 46 ? 20 : $length - 45;
  if ($length - 1 < 20) {
    return $down;
  } else {
    for (let $i = $length - 1; $i > min; $i--) {
      let $l1 = $list[$i]&&$list[$i][key];
      let $l2 = $list[$i - 1]&&$list[$i - 1][key];
      let $l3 = $list[$i - 2]&&$list[$i - 2][key];
      let $l4 = $list[$i - 3]&&$list[$i - 3][key];
      let $l5 = $list[$i - 4]&&$list[$i - 4][key];
      if ($l3 < $l1 && $l3 < $l2 && $l3 < $l4 && $l3 < $l5) {
        $down[$list[$i - 2]["t"]] = {
          [key]: $l3,
          v: $list[$i - 2]["v"],
          c: $list[$i - 2]["c"],
          h: $list[$i - 2]["h"],
          l: $list[$i - 2]["l"],
        };
      } else if ($l2 < $l1 && $l2 < $l3 && $l2 < $l4 && $l2 < $l5) {
        $down[$list[$i - 1]["t"]] = {
          [key]: $l2,
          v: $list[$i - 1]["v"],
          c: $list[$i - 1]["c"],
          h: $list[$i - 1]["h"],
          l: $list[$i - 1]["l"],
        };
      }
    }
    let $firstDown = getFirstObject($down);

    if ($firstDown && $list[$length - 1][key] < $firstDown[key]) {
      $down[$list[$length - 1]["t"]] = {
        [key]: $list[$length - 1][key],
        v: $list[$length - 1]["v"],
        c: $list[$length - 1]["c"],
        h: $list[$length - 1]["h"],
        l: $list[$length - 1]["l"],
      };
      objKeySort($down);
    }
    return $down;
  }
}

function getFirstObject($down) {
  if (Object.keys($down).length > 1) {
    for (var key in $down) return $down[key];
  } else {
    return false;
  }
}
