import { Button, down, left, mouse, right, up, screen, Region, FileType } from "@nut-tree/nut-js";
import {
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  MouseSpeed,
} from "../constants/common";
import { RemoteControls } from "../constants/remoteControls";
import DrawFigureService from '../services/DrawFigureService';
import { imageToBase64 } from '../utils/base64image';
import internal from 'stream';

export default async function controlsSwitcher(
  message: string,
  duplexStream: internal.Duplex
) {
  const jsonMessageArray = message.split(" ");
  const jsonMessageCommand = jsonMessageArray[0];
  const firstMessageParam = jsonMessageArray[1];
  const secondMessageParam = jsonMessageArray[2];

  let { x, y } = await mouse.getPosition();

  switch (jsonMessageCommand) {
    case RemoteControls.MOUSE_DOWN:
      y += +firstMessageParam;
      mouse.setPosition({ x, y });
      duplexStream.write(`${RemoteControls.MOUSE_DOWN} ${firstMessageParam}`);

      break;
    case RemoteControls.MOUSE_UP:
      y -= +firstMessageParam;
      mouse.setPosition({ x, y });
      duplexStream.write(`${RemoteControls.MOUSE_UP} ${firstMessageParam}`);

      break;
    case RemoteControls.MOUSE_LEFT:
      x -= +firstMessageParam;
      mouse.setPosition({ x, y });
      duplexStream.write(`${RemoteControls.MOUSE_LEFT} ${firstMessageParam}`);

      break;
    case RemoteControls.MOUSE_RIGHT:
      x += +firstMessageParam;
      mouse.setPosition({ x, y });
      duplexStream.write(`${RemoteControls.MOUSE_RIGHT} ${firstMessageParam}`);

      break;
    case RemoteControls.MOUSE_POSITION:
      duplexStream.write(`${RemoteControls.MOUSE_POSITION} ${x}px,${y}px`);

      break;
    case RemoteControls.DRAW_CIRCLE:
      duplexStream.write(`${RemoteControls.DRAW_CIRCLE} ${firstMessageParam}`);

      const circlePoints = DrawFigureService.getCirclePoints(x, y, firstMessageParam);

      await mouse.setPosition(circlePoints?.[0]);
      await mouse.pressButton(Button.LEFT)

      mouse.config.mouseSpeed = MouseSpeed.SLOW;

      await mouse.move(circlePoints)

      mouse.config.mouseSpeed = MouseSpeed.DEFAULT;

      await mouse.releaseButton(Button.LEFT)
      await mouse.setPosition({ x, y });

      break;
    case RemoteControls.DRAW_RECTANGLE:
      duplexStream.write(
        `${RemoteControls.DRAW_RECTANGLE} ${firstMessageParam} ${secondMessageParam}`
      );
      await mouse.pressButton(Button.LEFT)

      mouse.config.mouseSpeed = MouseSpeed.SLOW;

      await mouse.move(right(+firstMessageParam));
      await mouse.move(down(+secondMessageParam))
      await mouse.move(left(+firstMessageParam));
      await mouse.move(up(+secondMessageParam));

      mouse.config.mouseSpeed = MouseSpeed.DEFAULT;

      await mouse.releaseButton(Button.LEFT)

      break;
    case RemoteControls.DRAW_SQUARE:
      duplexStream.write(`${RemoteControls.DRAW_SQUARE} ${firstMessageParam}`);

      await mouse.pressButton(Button.LEFT)

      mouse.config.mouseSpeed = MouseSpeed.SLOW;

      await mouse.move(right(+firstMessageParam));
      await mouse.move(down(+firstMessageParam))
      await mouse.move(left(+firstMessageParam));
      await mouse.move(up(+firstMessageParam));

      mouse.config.mouseSpeed = MouseSpeed.DEFAULT;

      await mouse.releaseButton(Button.LEFT)

      break;
    case RemoteControls.PRINT_SCREEN:
      const _left = x - IMAGE_WIDTH / 2;
      const _top = y - IMAGE_HEIGHT / 2;
      const _width = IMAGE_WIDTH;
      const _height = IMAGE_HEIGHT;
      const region = new Region(_left, _top, _width, _height);

      const tempImage = await screen.grabRegion(region);

      const capturedScreen = await imageToBase64(tempImage);

      const croppedBase64ImageText = capturedScreen?.split(",")[1];

      duplexStream.write(`${RemoteControls.PRINT_SCREEN} ${croppedBase64ImageText}`);

      break;
    default:
      console.log(RemoteControls.UNKNOWN_COMMAND);

      break;
  }
}
