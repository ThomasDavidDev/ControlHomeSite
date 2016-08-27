using System;
using Bridge.Html5;

namespace ControlHome
{
	public class HTMLBackground
	{
		public HTMLDivElement background { get; private set; }

		public HTMLImageElement image { get; private set; }

		public HTMLBackground (string url, double opacity, int delay = 3)
		{
			background = new HTMLDivElement ();
			background.Style.ZIndex = "-1";
			background.Style.Overflow = Overflow.Hidden;
			background.Style.Visibility = Visibility.Visible;
			background.Style.Position = Position.Fixed;
			background.Style.Top = "0px";
			background.Style.Left = "0px";
			background.Style.Width = string.Format ("{0}px", Window.InnerWidth);
			background.Style.Height = string.Format ("{0}px", Window.InnerHeight);
			background.Style.Opacity = string.Format ("{0}", 0);

			Document.Body.AppendChild (background);

			image = new HTMLImageElement ();
			image.Src = url;
			image.Style.Position = Position.Relative;
			background.AppendChild (image);

			image.OnLoad += delegate {
				sizeElements ();

				background.Style.TransitionDuration = string.Format ("{0}s", delay);
				background.Style.Opacity = string.Format ("{0}", opacity);
			};

			Window.OnResize += delegate {
				background.Style.TransitionDuration = string.Format ("{0}s", 0);
				sizeElements ();
			};
		}

		private void sizeElements ()
		{
			double w = Window.InnerWidth;
			double h = Window.InnerHeight;
			background.Style.Width = string.Format ("{0}px", w);
			background.Style.Height = string.Format ("{0}px", h);
			double top, left, height, width;
			double frameR = w / h;
			double imageR = (double)image.NaturalWidth / (double)image.NaturalHeight;

			if (imageR > frameR) {
				height = h;
				width = h * imageR;
				top = 0;
				left = -(width - w) / 2;
			} else {
				height = w / imageR;
				width = w;
				top = -(height - h) / 2;
				left = 0;
			}

			image.Style.Top = string.Format ("{0}px", top);
			image.Style.Left = string.Format ("{0}px", left);
			image.Style.Height = string.Format ("{0}px", height);
			image.Style.Width = string.Format ("{0}px", width);
		}
	}
}