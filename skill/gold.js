class Gold {
  getGold($up, $down) {
    let $upKeys = Object.keys($up);
    let $downKeys = Object.keys($down);
    let $hight = $upKeys[$upKeys.length - 1];
    let $low = $downKeys[$downKeys.length - 1];
    if ($upKeys.length > 0 && $downKeys.length > 0) {
      // 如果第一點差距不到三天則向後找第二點
      if (
        $upKeys[0] - $downKeys[0] < 3 &&
        $upKeys[0] - $downKeys[0] > 0 &&
        $upKeys.length > 1
      ) {
        $hight = $upKeys[$upKeys.length - 2];
      } else if (
        $upKeys[0] - $downKeys[0] > -3 &&
        $upKeys[0] - $downKeys[0] < 0 &&
        $downKeys.length > 1
      ) {
        $low = $downKeys[$downKeys.length - 2];
      }
      // 計算黃金分割點
      let $response = {
        data: this.calculation($up[$hight], $down[$low]),
        hight: [$hight, $up[$hight]],
        low: [$low, $down[$low]],
        // 檢查:
        // $upKeys: $upKeys,
        // $downKeys: $downKeys,
      };
      return $response;
    } else {
      return false;
    }
  }

  calculation($hight, $low) {
    let $arr = {};
    // 超強勢整理
    $arr["超強勢"] =
      Math.round(($hight["h"] - ($hight["h"] - $low["l"]) * 0.191) * 100) / 100;
    // 強勢整理
    $arr["強勢"] =
      Math.round(($hight["h"] - ($hight["h"] - $low["l"]) * 0.382) * 100) / 100;
    // 中度整理
    $arr["中度"] =
      Math.round(($hight["h"] - ($hight["h"] - $low["l"]) * 0.5) * 100) / 100;
    // 弱勢整理
    $arr["弱勢"] =
      Math.round(($hight["h"] - ($hight["h"] - $low["l"]) * 0.618) * 100) / 100;
    // 超弱勢整理
    $arr["超弱勢"] =
      Math.round(($hight["h"] - ($hight["h"] - $low["l"]) * 0.809) * 100) / 100;
    return $arr;
  }
}
module.exports = Gold;
