using System;
using Bridge.Html5;

namespace ControlHome
{
	public class HTMLBox
	{
		string color = "rgba(200, 200, 200, .35)";
		string colorHover = "rgba(193, 193, 214, .10)";
		string colorActive = "rgba(193, 193, 214, .50)";

		public HTMLDivElement box { get; private set; }

		public HTMLDivElement text { get; private set; }

		public HTMLBox (string text = null, Action onClick = null)
		{
			box = new HTMLDivElement ();
			box.Style.Position = Position.Fixed;
			box.Style.BackgroundColor = color;
			box.Style.BorderColor = "#FDFDFD";
			box.Style.BorderStyle = BorderStyle.Solid;
			box.Style.TransitionDuration = "0.5s";
			box.Style.TransitionProperty = "background-color";

			box.OnMouseEnter += delegate {
				box.Style.BackgroundColor = colorHover;
			};
			box.OnMouseUp += delegate {
				box.Style.BackgroundColor = colorHover;
			};
			box.OnTouchStart += delegate {
				box.Style.BackgroundColor = colorActive;
			};
			box.OnMouseDown += delegate {
				box.Style.BackgroundColor = colorActive;
			};
			box.OnMouseLeave += delegate {
				box.Style.BackgroundColor = color;
			};
			box.OnTouchEnd += delegate {
				box.Style.BackgroundColor = color;
			};

			if (onClick != null)
				box.OnClick += delegate {
					onClick ();
				};

			if (text != null) {
				this.text = new HTMLDivElement ();
				this.text.InnerHTML = text;
				this.text.Style.Position = Position.Relative;
				this.text.Style.Color = "#FDFDFD";
				this.text.Style.TextAlign = TextAlign.Center;
				this.text.Style.FontFamily = "buttonFont";
				this.text.Style.Cursor = Cursor.Default;
				box.AppendChild (this.text);
			}
		}

		public void Action (Action onClick)
		{
			box.OnClick += delegate {
				onClick ();
			};
		}

		public void Color (string color, int delay)
		{
			box.Style.BackgroundColor = color;
			Window.SetTimeout (delegate {
				box.Style.BackgroundColor = this.color;
			}, delay);
		}

		public void Size (double Top, double Left, double Height, double Width)
		{
			double s = 0.8 * Math.Min (Width, Height);
			double borderWidth = s * 0.03;
			if (borderWidth < 1)
				borderWidth = 1;
			Top = Top + (Height - s) / 2;
			Left = Left + (Width - s) / 2;

			box.Style.BorderWidthString = string.Format ("{0}px", borderWidth);
			box.Style.BorderRadius = string.Format ("{0}px", s * 0.15);
			box.Style.Top = string.Format ("{0}px", Top);
			box.Style.Left = string.Format ("{0}px", Left);
			box.Style.Height = string.Format ("{0}px", s);
			box.Style.Width = string.Format ("{0}px", s);
			text.Style.FontSize = string.Format ("{0}px", s * 0.08);
			text.Style.Top = string.Format ("{0}px", (s - text.ClientHeight) / 2);
		}
	}
}