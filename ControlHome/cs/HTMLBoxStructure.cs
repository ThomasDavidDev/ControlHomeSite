using System;
using Bridge.Html5;
using System.Collections.Generic;

namespace ControlHome
{
	public class HTMLBoxStructure
	{
		public HTMLDivElement div { get; private set; }

		public List<HTMLBox> list { get; private set; }

		private bool parRel;

		public HTMLBoxStructure (HTMLDivElement div = null) : base ()
		{
			list = new List<HTMLBox> ();

			if (div != null) {
				this.div = div;
				parRel = true;
			} else {
				this.div = new HTMLDivElement ();
				this.div.Style.Position = Position.Fixed;
				this.div.Style.Top = "0px";
				this.div.Style.Left = "0px";
				Document.Body.AppendChild (this.div);
				parRel = false;
			}

			this.div.OnLoad += delegate {
				sizeElements ();
			};
			Window.OnResize += delegate {
				sizeElements ();
			};
		}

		public HTMLBox addBox (string text = null, Action onClick = null)
		{
			HTMLBox box = new HTMLBox (text, onClick);
			div.AppendChild (box.box);
			list.Add (box);
			sizeElements ();
			return box;
		}

		public void addBox (HTMLBox box)
		{
			div.AppendChild (box.box);
			list.Add (box);
			sizeElements ();
		}

		private void sizeElements ()
		{
			if (!parRel) {
				div.Style.Width = string.Format ("{0}px", Window.InnerWidth);
				div.Style.Height = string.Format ("{0}px", Window.InnerHeight);
			}

			double w = div.ClientWidth;
			double h = div.ClientHeight;
			double listLen = list.Count;
			if (listLen == 0)
				return;

			double y = Math.Round ((Math.Sqrt (listLen * (h / w))));
			double x = Math.Round (((listLen / Math.Sqrt (listLen * (h / w)))));

			if ((x * y) < listLen) {
				if ((x / y) < (w / h))
					x += 1;
				else
					y += 1;
			}

			while ((x * (y - 1)) >= listLen)
				y -= 1;
			while ((y * (x - 1)) >= listLen)
				x -= 1;

			double boxHeight = (h / y);
			double boxWidth = (w / x);

			for (int j = 0, k = 0; j < y; j++) {
				for (int i = 0; i < x && k < listLen; i++, k++) {
					double top = div.OffsetTop + j * boxHeight;
					double left = div.OffsetLeft + i * boxWidth;
					double height = ((j + 1) * boxHeight > h) ? h - top : boxHeight;
					double width = ((i + 1) * boxWidth > w) ? w - left : boxWidth;
					//list.ElementAt (k).Size (top, left, height, width);
					list [k].Size (top, left, height, width);
				}
			}
		}
	}
}