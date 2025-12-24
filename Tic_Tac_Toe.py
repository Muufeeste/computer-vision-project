Winning_list = [
    [1,2,3],[4,5,6],[7,8,9],
    [1,4,7],[2,5,8],[3,6,9],
    [1,5,9],[3,5,7]
]

Tic_list = [
    ["😄","😄","😄"],
    ["😄","😄","😄"],
    ["😄","😄","😄"]
]

Count = 9
player_x = "x"
player_y = "y"


def CheckPosition(row, col):
    if Tic_list[row][col] in ("x", "y"):
        print("Try it again")
        return False
    return True


def check_winner():
    flat = [
        Tic_list[0][0], Tic_list[0][1], Tic_list[0][2],
        Tic_list[1][0], Tic_list[1][1], Tic_list[1][2],
        Tic_list[2][0], Tic_list[2][1], Tic_list[2][2],
    ]

    for a, b, c in Winning_list:
        if flat[a-1] == flat[b-1] == flat[c-1] != "😄":
            return flat[a-1]
    return None


def print_board():
    for row in Tic_list:
        print(row)


def play_tic():
    global Count

    while Count > 0:

        # -------- Player X --------
        C = int(input("plz enter number as player x: "))
        if 1 <= C <= 9:
            row = (C-1)//3
            col = (C-1)%3
            if not CheckPosition(row, col):
                continue
            Tic_list[row][col] = player_x
        else:
            print("Invalid input")
            continue

        print_board()
        Count -= 1

        winner = check_winner()
        if winner:
            print(winner, "wins!")
            return
        if Count == 0:
            break

        # -------- Player Y --------
        D = int(input("plz enter number as player y: "))
        if 1 <= D <= 9:
            row = (D-1)//3
            col = (D-1)%3
            if not CheckPosition(row, col):
                continue
            Tic_list[row][col] = player_y
        else:
            print("Invalid input")
            continue

        print_board()
        Count -= 1

        winner = check_winner()
        if winner:
            print(winner, "wins!")
            return

    print("Draw!")


play_tic()
